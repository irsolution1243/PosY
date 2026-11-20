import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, type AuthSession } from './auth-session';
import type { PurchaseState } from './purchase-state';

async function getPurchaseFilepathAndEmail(): Promise<{ filepath: string; email: string }> {
  let email = '';
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUTH_COOKIE_NAME);
    if (cookie?.value) {
      const parsed = JSON.parse(decodeURIComponent(cookie.value)) as AuthSession;
      email = parsed.email || '';
    }
  } catch {}

  const slug = email ? email.replace(/[^a-z0-9]/gi, '-').toLowerCase() : '';
  const filepath = path.join(process.cwd(), 'data', slug ? `module-purchases-${slug}.json` : 'module-purchases.json');
  return { filepath, email };
}

let cachedPurchases: Record<string, Partial<PurchaseState>> = {};
let purchasesMutex = Promise.resolve();

export async function readPurchases(): Promise<Partial<PurchaseState>> {
  const { filepath } = await getPurchaseFilepathAndEmail();
  try {
    const raw = await readFile(filepath, 'utf8');
    if (!raw.trim()) {
      return cachedPurchases[filepath] ?? {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      cachedPurchases[filepath] = parsed;
      return parsed;
    }
    return {};
  } catch (err: unknown) {
    const isEnoent = (err as { code?: string })?.code === 'ENOENT';
    if (isEnoent) {
      cachedPurchases[filepath] = {};
      return {};
    }
    try {
      const backupRaw = await readFile(`${filepath}.backup`, 'utf8');
      const backupParsed = JSON.parse(backupRaw);
      if (backupParsed && typeof backupParsed === 'object') {
        cachedPurchases[filepath] = backupParsed;
        return backupParsed;
      }
    } catch {}

    return cachedPurchases[filepath] ?? {};
  }
}

export async function writePurchases(state: Partial<PurchaseState>): Promise<void> {
  const { filepath } = await getPurchaseFilepathAndEmail();
  cachedPurchases[filepath] = state;

  purchasesMutex = purchasesMutex.then(async () => {
    try {
      await mkdir(path.dirname(filepath), { recursive: true });
      const tempPath = `${filepath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
      const payload = `${JSON.stringify(state, null, 2)}\n`;

      await writeFile(tempPath, payload, 'utf8');
      await rename(tempPath, filepath);

      if (state.orders && state.orders.length > 0) {
        await writeFile(`${filepath}.backup`, payload, 'utf8').catch(() => {});
      }
    } catch (err) {
      console.error(`[CRITICAL] Error writing purchases to ${filepath}:`, err);
    }
  });

  await purchasesMutex;
}

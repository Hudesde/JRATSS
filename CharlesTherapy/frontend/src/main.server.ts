import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

function ensureServerLocalStorage() {
	if (typeof (globalThis as any).localStorage !== 'undefined') {
		return;
	}
	const storage = new Map<string, string>();
	const serverStorage: Storage = {
		get length() {
			return storage.size;
		},
		clear() {
			storage.clear();
		},
		getItem(key: string) {
			return storage.has(key) ? storage.get(key)! : null;
		},
		key(index: number) {
			return Array.from(storage.keys())[index] ?? null;
		},
		removeItem(key: string) {
			storage.delete(key);
		},
		setItem(key: string, value: string) {
			storage.set(key, value);
		},
	};
	(globalThis as any).localStorage = serverStorage;
}

ensureServerLocalStorage();

const bootstrap = (context: BootstrapContext) =>
	bootstrapApplication(AppComponent, config, context);

export default bootstrap;

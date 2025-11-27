<script lang="ts">
        import { onMount } from 'svelte';
        import { goto } from '$app/navigation';

        import { BACKEND_STORAGE_KEY } from '$lib/constants';

        // Chrome APIs are available when the build is loaded as an extension.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        declare const chrome: any;

        export const prerender = true;

        let backendUrl = '';
        let saved = false;
        let saving = false;

        const normalizeUrl = (url: string) => url.trim().replace(/\/+$/, '');

        const readFromChromeStorage = () => {
                if (typeof chrome === 'undefined' || !chrome?.storage?.sync) return;

                chrome.storage.sync.get([BACKEND_STORAGE_KEY], (result) => {
                        const stored = result?.[BACKEND_STORAGE_KEY];
                        if (typeof stored === 'string' && stored.trim().length > 0) {
                                backendUrl = stored;
                        }
                });
        };

        onMount(() => {
                backendUrl = localStorage.getItem(BACKEND_STORAGE_KEY) ?? '';
                readFromChromeStorage();
        });

        const saveBackendUrl = async () => {
                saved = false;
                saving = true;

                const normalized = normalizeUrl(backendUrl);
                backendUrl = normalized;

                localStorage.setItem(BACKEND_STORAGE_KEY, normalized);

                if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
                        chrome.storage.sync.set({ [BACKEND_STORAGE_KEY]: normalized });
                }

                saved = true;
                saving = false;
        };
</script>

<svelte:head>
        <title>Extension Options</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 text-gray-900">
        <div class="mx-auto max-w-xl px-6 py-10 space-y-6">
                <div class="space-y-2">
                        <h1 class="text-2xl font-semibold">Backend URL</h1>
                        <p class="text-sm text-gray-600">
                                Set the backend URL used by the chat panel. Changes are stored in the extension and applied on
                                the next load.
                        </p>
                </div>

                <div class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <label class="block text-sm font-medium text-gray-800" for="backend-url">Backend URL</label>
                        <input
                                id="backend-url"
                                class="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                                placeholder="https://your-backend.example.com"
                                bind:value={backendUrl}
                        />
                        <div class="flex items-center gap-3">
                                <button
                                        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                                        on:click|preventDefault={saveBackendUrl}
                                        disabled={saving || backendUrl.trim().length === 0}
                                >
                                        {saving ? 'Saving…' : 'Save'}
                                </button>
                                {#if saved}
                                        <span class="text-sm text-green-700">Saved. Reload the panel to use the new URL.</span>
                                {/if}
                        </div>
                </div>

                <div class="text-sm text-gray-600">
                        <button
                                class="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100"
                                on:click={() => goto('/?view=panel')}
                        >
                                Open chat panel
                        </button>
                </div>
        </div>
</div>

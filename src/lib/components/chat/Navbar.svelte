<script lang="ts">
        import ModelSelector from '../chat/ModelSelector.svelte';
        import Image from '../common/Image.svelte';

        export let initNewChat: Function;
        export let shareEnabled: boolean = false;
        export let scrollTop = 0;

        export let chat;
        export let history;
        export let selectedModels;
        export let showModelSelector = true;
        export let currentModel = null;

        export let onSaveTempChat: () => {};
        export let archiveChatHandler: (id: string) => void;
        export let moveChatHandler: (id: string, folderId: string) => void;
        export let onSignOut: () => void;

        let menuOpen = false;

        const toggleMenu = () => {
                menuOpen = !menuOpen;
        };
</script>

<nav
        class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/80 px-2 py-1.5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
        on:click={() => {
                menuOpen = false;
        }}
>
        <div class="flex flex-1 min-w-0 items-center gap-3">
                {#if currentModel}
                        <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <Image
                                        alt={currentModel?.name ?? currentModel?.id ?? 'Model avatar'}
                                        src={currentModel?.info?.meta?.image_url ?? currentModel?.image_url}
                                />
                        </div>
                {/if}

                {#if showModelSelector}
                        <div class="flex-1 min-w-0">
                                <ModelSelector bind:selectedModels />
                        </div>
                {/if}
        </div>

        <div class="relative pr-1">
                <button
                        class="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="Open menu"
                        on:click|stopPropagation={toggleMenu}
                >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                                <path d="M12 6.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                        </svg>
                </button>

                {#if menuOpen}
                        <div class="absolute right-1 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white text-sm shadow-lg dark:border-gray-800 dark:bg-gray-900">
                                <button
                                        class="block w-full px-3 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                                        on:click={() => {
                                                menuOpen = false;
                                                initNewChat?.();
                                        }}
                                >
                                        New chat
                                </button>
                                <button
                                        class="block w-full px-3 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                                        on:click={() => {
                                                menuOpen = false;
                                                onSignOut?.();
                                        }}
                                >
                                        Sign out
                                </button>
                        </div>
                {/if}
        </div>
</nav>

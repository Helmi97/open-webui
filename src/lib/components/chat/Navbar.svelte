<script lang="ts">
        import ModelSelector from '../chat/ModelSelector.svelte';

        export let initNewChat: Function;
        export let shareEnabled: boolean = false;
        export let scrollTop = 0;

        export let chat;
        export let history;
        export let selectedModels;
        export let showModelSelector = true;

        export let onSaveTempChat: () => {};
        export let archiveChatHandler: (id: string) => void;
        export let moveChatHandler: (id: string, folderId: string) => void;
</script>

<nav
        class="sticky top-0 z-30 w-full pt-1 pb-1 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800"
>
        {#if showModelSelector}
                <div class="flex-1 px-2">
                        <ModelSelector bind:selectedModels />
                </div>
        {/if}
</nav>

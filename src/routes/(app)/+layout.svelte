<script lang="ts">
        import { onMount } from 'svelte';

        import { goto } from '$app/navigation';

        import { getModels, getToolServersData } from '$lib/apis';
        import { getUserSettings } from '$lib/apis/users';

        import { config, user, settings, models, toolServers } from '$lib/stores';

        import Spinner from '$lib/components/common/Spinner.svelte';

        let loaded = false;

        const setUserSettings = async () => {
                let userSettings = await getUserSettings(localStorage.token).catch((error) => {
                        console.error(error);
                        return null;
                });

                if (!userSettings) {
                        try {
                                userSettings = JSON.parse(localStorage.getItem('settings') ?? '{}');
                        } catch (e: unknown) {
                                console.error('Failed to parse settings from localStorage', e);
                                userSettings = {};
                        }
                }

                if (userSettings?.ui) {
                        settings.set(userSettings.ui);
                }
        };

        const setModels = async () => {
                models.set(
                        await getModels(
                                localStorage.token,
                                $config?.features?.enable_direct_connections ? ($settings?.directConnections ?? null) : null
                        )
                );
        };

        const setToolServers = async () => {
                const toolServersData = await getToolServersData($settings?.toolServers ?? []);
                toolServers.set(toolServersData?.filter((data) => !!data && !data.error) ?? []);
        };

        onMount(async () => {
                if ($user === undefined || $user === null) {
                        await goto('/auth');
                        return;
                }

                await setUserSettings();
                await Promise.all([setModels(), setToolServers()]);

                loaded = true;
        });
</script>

{#if $user}
        <div class="min-h-screen max-h-[100dvh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {#if loaded}
                        <slot />
                {:else}
                        <div class="w-full h-full flex items-center justify-center py-10">
                                <Spinner className="size-5" />
                        </div>
                {/if}
        </div>
{/if}

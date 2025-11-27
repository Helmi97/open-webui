<script lang="ts">
        import { io } from 'socket.io-client';
        import { Toaster } from 'svelte-sonner';
        import { onMount, setContext } from 'svelte';

        import { goto } from '$app/navigation';

        import i18n, { initI18n } from '$lib/i18n';

        import {
                config,
                user,
                settings,
                theme,
                WEBUI_NAME,
                mobile,
                socket
        } from '$lib/stores';
        import { getBackendConfig } from '$lib/apis';
        import { getSessionUser } from '$lib/apis/auths';
        import { getUserSettings } from '$lib/apis/users';
        import { WEBUI_BASE_URL, APP_BASE_URL } from '$lib/constants';

        import Spinner from '$lib/components/common/Spinner.svelte';

        import '../tailwind.css';
        import '../app.css';
        import 'tippy.js/dist/tippy.css';

        const BREAKPOINT = 768;

        let loaded = false;

        setContext('i18n', i18n);

        const setupSocket = async (enableWebsocket: boolean) => {
                const _socket = io(`${WEBUI_BASE_URL}` || undefined, {
                        reconnection: true,
                        reconnectionDelay: 1000,
                        reconnectionDelayMax: 5000,
                        randomizationFactor: 0.5,
                        path: '/ws/socket.io',
                        transports: enableWebsocket ? ['websocket'] : ['polling', 'websocket'],
                        auth: { token: localStorage.token }
                });

                await socket.set(_socket);
        };

        const loadUser = async () => {
                const currentUrl = `${window.location.pathname}${window.location.search}`;
                const sessionUser = await getSessionUser(localStorage.token).catch(() => null);

                if (!sessionUser) {
                        localStorage.removeItem('token');
                        await goto(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
                        return null;
                }

                await user.set(sessionUser);

                const userSettings = await getUserSettings(localStorage.token).catch(() => null);
                if (userSettings?.ui) {
                        settings.set(userSettings.ui);
                } else {
                        try {
                                settings.set(JSON.parse(localStorage.getItem('settings') ?? '{}'));
                        } catch (error) {
                                settings.set({});
                        }
                }

                return sessionUser;
        };

        onMount(() => {
                const handleResize = () => {
                        mobile.set(window.innerWidth < BREAKPOINT);
                };

                theme.set(localStorage.theme ?? 'system');
                handleResize();
                window.addEventListener('resize', handleResize);

                const initialize = async () => {
                        await initI18n();

                        const backendConfig = await getBackendConfig().catch(() => null);
                        if (!backendConfig) {
                                if (window.location.pathname !== '/error') {
                                        await goto('/error');
                                }

                                loaded = true;
                                return;
                        }

                        await config.set(backendConfig);
                        await WEBUI_NAME.set(backendConfig.name);

                        await setupSocket(backendConfig.features?.enable_websocket ?? true);

                        const redirectUrl = encodeURIComponent(
                                `${window.location.pathname}${window.location.search}`
                        );

                        if (!localStorage.token) {
                                await goto(`/auth?redirect=${redirectUrl}`);
                                loaded = true;
                                return;
                        }

                        const sessionUser = await loadUser();
                        loaded = true;

                        if (!sessionUser) {
                                return;
                        }
                };

                initialize();

                return () => {
                        window.removeEventListener('resize', handleResize);
                };
        });
</script>

<svelte:head>
        <title>{$WEBUI_NAME}</title>
        <link crossorigin="anonymous" rel="icon" href="{APP_BASE_URL}/static/favicon.png" />
        <meta name="apple-mobile-web-app-title" content={$WEBUI_NAME} />
        <meta name="description" content={$WEBUI_NAME} />
        <link
                rel="search"
                type="application/opensearchdescription+xml"
                title={$WEBUI_NAME}
                href="/opensearch.xml"
                crossorigin="use-credentials"
        />
</svelte:head>

{#if loaded}
        <slot />
{:else}
        <div class="w-full h-screen flex items-center justify-center">
                <Spinner className="size-5" />
        </div>
{/if}

<Toaster
        theme={$theme.includes('dark')
                ? 'dark'
                : $theme === 'system'
                        ? window.matchMedia('(prefers-color-scheme: dark)').matches
                                ? 'dark'
                                : 'light'
                        : 'light'}
        richColors
        position="top-right"
        closeButton
/>

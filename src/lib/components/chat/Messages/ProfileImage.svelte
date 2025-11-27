<script lang="ts">
        import { APP_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';

        export let className = 'size-8';
        export let src = `${APP_BASE_URL}/static/favicon.png`;
</script>

<img
	aria-hidden="true"
        src={src === ''
                ? `${APP_BASE_URL}/static/favicon.png`
                : src.startsWith(WEBUI_BASE_URL) ||
                          src.startsWith(APP_BASE_URL) ||
                          src.startsWith('https://www.gravatar.com/avatar/') ||
                          src.startsWith('data:') ||
                          src.startsWith('/')
                        ? src
                        : `${APP_BASE_URL}/user.png`}
	class=" {className} object-cover rounded-full"
	alt="profile"
	draggable="false"
/>

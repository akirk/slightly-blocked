import { store } from '@wordpress/interactivity';

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const { callbacks, state } = store('slightly/color-scheme', {
	state: {
		get isLoggedIn() {
			return 0 < state.userId;
		}
	},
	actions: {
		toggle() {
			// Cycle through: auto → light → dark → auto
			if (state.isAuto) {
				state.colorScheme = 'light';
				state.isDark = false;
				state.isAuto = false;
			} else if (state.isDark) {
				state.colorScheme = 'auto';
				state.isDark = prefersDarkScheme.matches;
				state.isAuto = true;
			} else {
				state.colorScheme = 'dark';
				state.isDark = true;
				state.isAuto = false;
			}

			if (state.isLoggedIn) {
				wp.apiFetch({
					path: `/wp/v2/users/${state.userId}`,
					method: 'POST',
					data: {
						meta: {
							[state.name]: state.colorScheme
						}
					}
				});
				return;
			}

			let path = state.cookiePath || '/';
			let domain = state.cookieDomain ? '; domain=' + state.cookieDomain : '';

			document.cookie = `${state.name}=${state.colorScheme};path=${path}${domain}`;
		}
	},
	callbacks: {
		init() {
			if ('dark' === state.colorScheme) {
				state.isDark = true;
				state.isAuto = false;
				return;
			}

			if ('light' === state.colorScheme) {
				state.isDark = false;
				state.isAuto = false;
				return;
			}

			// Auto mode: follow system preference
			state.isDark = prefersDarkScheme.matches;
			state.isAuto = true;
		},
		updateScheme() {
			document.documentElement.style.setProperty(
				'color-scheme',
				state.isAuto ? 'light dark' : state.colorScheme
			);
		}
	}
});

prefersDarkScheme.addEventListener('change', () => {
	if (state.isAuto) {
		state.isDark = prefersDarkScheme.matches;
	}
});

import App from './App.svelte';

import 'bootswatch/dist/lux/bootstrap.min.css'
import 'toastr/build/toastr.min.js'
import 'toastr/build/toastr.min.css'

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
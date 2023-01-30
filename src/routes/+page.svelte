<script>
	/** @type {import('./$types').ActionData} */
	export let form;
	let buttonClass;
	function spin() {
		buttonClass = 'loading';
	}
</script>

<main>
	<h1>Spinneri</h1>
	<form>
		<textarea name="originalText" id="orignalText" cols="30" rows="10" maxlength="100" />
		<button on:click={spin}><p class={buttonClass}>Spin</p></button>
	</form>
	{#await form}
		<!-- <p>No value</p> -->
	{:then formResult}
		{#if formResult?.result}
			<p>{formResult.result}</p>
		{:else}
			<p class="danger">No result</p>
		{/if}
	{:catch}
		<p class="danger">❌ App crashed!!</p>
	{/await}
</main>

<style>
	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #444;
		--primary-color: rgb(180, 241, 58);
		color: var(--primary-color);
	}
	:global(.danger) {
		color: rgba(217, 0, 0, 0.735);
	}
	main {
		display: flex;
		flex-direction: column;
		max-width: 850px;
		margin: 0 auto;
		gap: 1rem;
	}
	h1 {
		text-transform: uppercase;
	}
	:global(button) {
		padding: 1rem 2rem;
		color: var(--primary-color);
		background-color: #555;
		width: fit-content;
		transition: all 0.2s ease-in-out;
		color: white;
		font-weight: bold;
		border: none;
		outline: none;
		border-radius: 2rem;
	}
	:global(button:hover) {
		background-color: #333;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	textarea {
		resize: vertical;
		padding: 1rem;
		outline: none;
		width: 100%;
	}
	.loading {
		animation: rotate 1.5s linear infinite;
	}
	@keyframes rotate {
		to {
			transform: rotate(360deg);
		}
	}
	button p {
		margin: 0;
	}
</style>

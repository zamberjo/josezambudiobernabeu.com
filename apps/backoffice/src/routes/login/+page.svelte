<script lang="ts">
	let { form } = $props();
</script>

<main class="login">
	<h1>Zambu <span>backoffice</span></h1>
	<form method="POST">
		<label>
			Email
			<input name="email" type="email" autocomplete="username" required value={form?.email ?? ''} />
		</label>
		<label>
			Contraseña
			<input name="password" type="password" autocomplete="current-password" required />
		</label>
		{#if form?.message}<p class="error" role="alert">{form.message}</p>{/if}
		<button type="submit" class="primary">Entrar</button>
	</form>
</main>

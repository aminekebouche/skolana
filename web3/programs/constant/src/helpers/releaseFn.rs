pub fn release(ctx: Context<Release>, _data_bump: u8, percent: u8 ) -> Result<()> {
	let data_account = &mut ctx.accounts.data_account;

	data_account.percent_available = percent;
	Ok(())
}

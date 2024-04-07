pub fn initialize(ctx: Context<Initialize>, beneficiaries: Vec<Beneficiary>, amount: u64, decimals: u8) -> Result<()> {
	let data_account = &mut ctx.accounts.data_account;
	data_account.beneficiaries = beneficiaries;
	data_account.percent_available = 0;
	data_account.token_amount = amount;
	data_account.decimals = decimals;
	data_account.initializer = ctx.accounts.sender.to_account_info().key();
	data_account.escrow_wallet = ctx.accounts.escrow_wallet.to_account_info().key();
	data_account.token_mint = ctx.accounts.token_mint.to_account_info().key();

	let transfer_instruction = Transfer {
		from: ctx.accounts.wallet_to_withdraw_from.to_account_info(),
		to: ctx.accounts.escrow_wallet.to_account_info(),
		authority: ctx.accounts.sender.to_account_info(),
	};

	let cpi_ctx = CpiContext::new(
		ctx.accounts.token_program.to_account_info(),
		transfer_instruction,
	);

	token::transfer(cpi_ctx, data_account.token_amount * u64::pow(10, decimals as u32))?;

	Ok(())
}

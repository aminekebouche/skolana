#[derive(Accounts)]
#[instruction(data_bump: u8)]
pub struct Release<'info> {
    #[account(
        mut,
        seeds = [b"data_account", token_mint.key().as_ref()],
        bump = data_bump,
        constraint=data_account.initializer == sender.key()
    )]
    pub data_account: Account<'info, DataAccount>,

    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,
}

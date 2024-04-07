
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + 1 + 8 + 32 + 32 + 32 + 1 + (4 + 50 * (32 + 8 + 8) + 1), // Can take 50 accounts to vest to
        seeds = [b"data_account", token_mint.key().as_ref()],
        bump
    )]
    pub data_account: Account<'info, DataAccount>,

    #[account(
        init,
        payer = sender,
        seeds=[b"escrow_wallet".as_ref(), token_mint.key().as_ref()],
        bump,
        token::mint=token_mint,
        token::authority=data_account,
    )]
    pub escrow_wallet: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint=wallet_to_withdraw_from.owner == sender.key(),
        constraint=wallet_to_withdraw_from.mint == token_mint.key()
    )]
    pub wallet_to_withdraw_from: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

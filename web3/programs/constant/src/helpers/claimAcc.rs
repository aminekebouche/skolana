#[derive(Accounts)]
#[instruction(data_bump: u8, wallet_bump: u8)]
pub struct Claim<'info> {
    #[account(
        mut,
        seeds = [b"data_account", token_mint.key().as_ref()],
        bump = data_bump,
    )]
    pub data_account: Account<'info, DataAccount>,

    #[account(
        mut,
        seeds=[b"escrow_wallet".as_ref(), token_mint.key().as_ref()],
        bump = wallet_bump,
    )]
    pub escrow_wallet: Account<'info, TokenAccount>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = token_mint,
        associated_token::authority = sender,
    )]
    pub wallet_to_deposit_to: Account<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>, // Don't actually use it in the instruction, but used for the wallet_to_deposit_to account

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

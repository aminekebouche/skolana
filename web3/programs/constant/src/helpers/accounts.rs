#[derive(Default, Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Beneficiary {
    pub key: Pubkey,
    pub allocated_tokens: u64,
    pub claimed_tokens: u64,
}

#[account]
#[derive(Default)]
pub struct DataAccount {
    pub percent_available: u8,
    pub token_amount: u64,
    pub initializer: Pubkey,
    pub escrow_wallet: Pubkey,
    pub token_mint: Pubkey,
    pub beneficiaries: Vec<Beneficiary>,
    pub decimals: u8
}

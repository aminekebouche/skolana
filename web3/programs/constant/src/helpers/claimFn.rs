pub fn claim(ctx: Context<Claim>, data_bump: u8, _escrow_bump: u8) -> Result<()> {
        let sender = &mut ctx.accounts.sender;
        let escrow_wallet = &mut ctx.accounts.escrow_wallet;
        let data_account = &mut ctx.accounts.data_account;
        let beneficiaries = &data_account.beneficiaries;
        let token_program = &mut ctx.accounts.token_program;
        let token_mint_key = &mut ctx.accounts.token_mint.key();
        let beneficiary_ata = &mut ctx.accounts.wallet_to_deposit_to;
        let decimals = data_account.decimals;

        let (index, beneficiary) = beneficiaries.iter().enumerate().find(|(_, beneficiary)| beneficiary.key == *sender.to_account_info().key)
        .ok_or(VestingError::BeneficiaryNotFound)?;

        let amount_to_transfer = ((data_account.percent_available as f32 / 100.0) * beneficiary.allocated_tokens as f32) as u64;
        require!(amount_to_transfer > beneficiary.claimed_tokens, VestingError::ClaimNotAllowed); // Allowed to claim new tokens

        // Transfer Logic:
        let seeds = &["data_account".as_bytes(), token_mint_key.as_ref(), &[data_bump]];
        let signer_seeds = &[&seeds[..]];

        let transfer_instruction = Transfer{
            from: escrow_wallet.to_account_info(),
            to: beneficiary_ata.to_account_info(),
            authority: data_account.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            token_program.to_account_info(),
            transfer_instruction,
            signer_seeds
        );

        token::transfer(cpi_ctx, amount_to_transfer * u64::pow(10, decimals as u32))?;
        data_account.beneficiaries[index].claimed_tokens = amount_to_transfer;

        Ok(())
}

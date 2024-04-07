use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use solana_program::{pubkey, pubkey::Pubkey};

use mpl_token_metadata::types::DataV2;

pub mod constant;
pub mod states;
use crate::{constant::*, states::*};

const ADMIN_PUBKEY: Pubkey = pubkey!("Cgy17bfc4egAANA2ced1L1de3Y3fiN6XUfhT2RqdAGws");
const MAX_HEALTH: u8 = 100;
pub const PREFIX: &str = "metadata";
pub const EDITION: &str = "edition";
fn find_metadata_account(mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            PREFIX.as_bytes(),
            mpl_token_metadata::ID.as_ref(),
            mint.as_ref(),
        ],
        &mpl_token_metadata::ID,
    )
}

pub fn find_master_edition_account(mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            PREFIX.as_bytes(),
            crate::id().as_ref(),
            mint.as_ref(),
            EDITION.as_bytes(),
        ],
        &crate::id(),
    )
}

// Is the program adress
declare_id!("74ndpudftAuoaDbKTzv6hLBVKiuVuLzDDzUoqPyRvQ7f");

#[program]
pub mod blog_sol {
    use super::*;

    pub fn init_user(ctx: Context<InitUser>, name: String, avatar: String) -> Result<()> {
        //logic

        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        user_account.name = name;
        user_account.avatar = avatar;
        user_account.last_post_id = 0;
        user_account.post_count = 0;
        user_account.authority = authority.key();

        Ok(())
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        types: String,
        content: String,
        documents: String,
        price: u32,
    ) -> Result<()> {
        let post_acount = &mut ctx.accounts.post_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        post_acount.id = user_account.last_post_id;
        post_acount.types = types;
        post_acount.content = content;
        post_acount.documents = documents;
        post_acount.price = price;
        post_acount.user = user_account.key();
        post_acount.authority = authority.key();

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();
        user_account.post_count = user_account.post_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn init_nft(
        ctx: Context<InitNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // create mint account
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        );

        mint_to(cpi_context, 1)?;

        // create metadata account
        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        let data_v2 = DataV2 {
            name: name,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(cpi_context, data_v2, false, true, None)?;

        //create master edition account
        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.master_edition_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                metadata: ctx.accounts.metadata_account.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        create_master_edition_v3(cpi_context, None)?;

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction()]
pub struct InitUser<'info> {
    #[account(
    init,
    seeds = [USER_SEED, authority.key.as_ref()],
    bump,
    payer = authority,
    space = 2312 + 8
    )]
    pub user_account: Account<'info, UserAcount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreatePost<'info> {
    #[account(
    init,
    seeds = [POST_SEED, authority.key.as_ref(), &[user_account.last_post_id as u8].as_ref()],
    bump,
    payer = authority,
    space = 2376 + 8
    )]
    pub post_account: Account<'info, PostAcount>,

    #[account(
    mut,
    seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority

    )]
    pub user_account: Account<'info, UserAcount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitNFT<'info> {
    /// CHECK: ok, we are passing in this account ourselves
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    payer = signer,
    mint::decimals = 0,
    mint::authority = signer.key(),
    mint::freeze_authority = signer.key(),
    )]
    pub mint: Account<'info, Mint>,
    #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = signer
    )]
    pub associated_token_account: Account<'info, TokenAccount>,
    /// CHECK - address
    #[account(
    mut,
    address=find_metadata_account(&mint.key()).0,
    )]
    pub metadata_account: AccountInfo<'info>,
    /// CHECK: address
    #[account(
    mut,
    address=find_master_edition_account(&mint.key()).0,
    )]
    pub master_edition_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

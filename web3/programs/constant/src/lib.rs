use anchor_lang::prelude::*;

pub mod constant;
pub mod states;
use crate::{constant::*, states::*};

// Is the program adress
declare_id!("FxahHHtL963Tthd6LW1Vj4oJq2KVyd2trRevjDiw1qKE");

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

    pub fn create_post(ctx:Context<CreatePost>, title: String, content: String) -> Result<()> {

        let  post_acount = &mut ctx.accounts.post_account;
        let  user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;


        post_acount.id = user_account.last_post_id;
        post_acount.title = title;
        post_acount.content = content;
        post_acount.user = user_account.key();
        post_acount.authority = authority.key();

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();
        user_account.post_count = user_account.post_count.checked_add(1).unwrap();


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
    pub user_account:Account<'info, UserAcount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,


}

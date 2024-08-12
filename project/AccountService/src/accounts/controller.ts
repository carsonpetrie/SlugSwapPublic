import {
  Body,
  Query,
  Controller,
  Get,
  Post,
  Response,
  Route,
} from 'tsoa';

import { Account, Credentials, UserID, newAccount, editAccount } from '.';
import { AccountService } from './service';

@Route('account')
export class AccountController extends Controller {
  @Post('authenticate')
  @Response('401', 'Unauthorized')
  public async authenticateAccount(
    @Body() credentials: Credentials
  ): Promise<Account|undefined> {
    return new AccountService().authenticateAccount(credentials)
      .then((account: Account) => {
        return account;
      }, () => {
        this.setStatus(401);
        return undefined;
      });
  }
  
  @Post('create')
  @Response('409', 'Error')
  public async createAccount( 
    @Body() newAccountReq: newAccount
  ): Promise<void|Account|undefined> {
    return new AccountService().createAccount(newAccountReq.email, newAccountReq.password, newAccountReq.name)
      .then(async (account: Account|undefined): Promise<Account|undefined> => {
        return account
      })
      .catch(() => {
        return this.setStatus(409); 
      }
      );
  }

  @Get()
  public async getAccount(
    @Query() id: string
  ): Promise<void|Account> {
    return new AccountService().getAccount(id)
      .then(async (account: Account): Promise<Account> => {
        return account
      })
      .catch(() => {
        return this.setStatus(404);
      }
      );
  }

  @Post('edit')
  @Response('404', 'Error')
  public async editAccount(
    @Body() editReq: editAccount
  ): Promise<void|Account|undefined> {
    return new AccountService().editAccount(editReq.id, editReq.description)
      .then(async (account: Account|undefined): Promise<Account|undefined> => {
        return account
      })
      .catch(() => {
        return this.setStatus(404);
      }
      );
  }

  @Post('delete')
  @Response('404', 'Error')
  public async deleteAccount(
    @Body() userID: UserID
  ): Promise<void|Account|undefined> {
    return new AccountService().deleteAccount(userID.id)
      .then(async (account: Account|undefined): Promise<Account|undefined> => {
        return account
      })
      .catch(() => {
        return this.setStatus(404);
      }
      );
  }
}

@Route('accounts')
export class AccountsController extends Controller {
  @Get()
  public async getAccounts(): Promise<Account[]> {
    return new AccountService().getAccounts();
  }
}

@Route('enable')
export class EnableController extends Controller {
  @Post()
  @Response('404', 'Unknown')
  public async enableAccount(
    @Body() userid: UserID
  ): Promise<string|undefined> {
    return new AccountService().enableAccount(userid.id)
      .then(async (account: string|undefined): Promise<|string|undefined> => {
        if (!account) {
          this.setStatus(404)
        }
        return account
      });
  }
}

@Route('disable')
export class DisableController extends Controller {
  @Post()
  @Response('404', 'Unknown')
  public async enableAccount(
    @Body() userid: UserID
  ): Promise<string|undefined> {
    return new AccountService().disableAccount(userid.id)
      .then(async (account: string|undefined): Promise<|string|undefined> => {
        if (!account) {
          this.setStatus(404)
        }
        return account
      });
  }
}
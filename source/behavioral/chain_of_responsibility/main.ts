/*
  🐝 Chain Of Responsibility
  --------------------------
  The chain of responsibility pattern is used to process varied requests, each of which may be dealt with by a different handler.
*/

/**
 * Declare que common handler to link all togueter
 */
interface Withdrawing {
  withdraw(amount: number): boolean;
}

interface DepositValues {
  // The deposit value amount
  value: number;

  // How many depositis of value
  quantity: number;

  // The next handler
  next?: Withdrawing;
}

class Deposit implements Withdrawing, DepositValues {
  constructor(public value: number, public quantity: number, public next?: Withdrawing) {}

  withdraw(amount: number): boolean {
    let _amount = amount;
    const value = this.value;

    function canTakeSomeBill(want: number): boolean {
      return want / value > 0;
    }

    let quantity = this.quantity;

    while (canTakeSomeBill(_amount) && quantity > 0) {
      _amount -= this.value;
      quantity -= 1;
    }

    if (!(_amount > 0)) return true;

    const next = this.next;

    if (next) {
      return next.withdraw(_amount);
    }

    return false;
  }
}

class ATM implements Withdrawing {
  private get startPile(): Withdrawing {
    return this.hundred;
  }

  constructor(
    public hundred: Withdrawing,
    public fifty: Withdrawing,
    public twenty: Withdrawing,
    public ten: Withdrawing
  ) {}

  withdraw(amount: number): boolean {
    return this.startPile.withdraw(amount);
  }
}

/*
### Usage
*/
// Create deposits of money and link them together 10 < 20 < 50 < 100.**
const ten = new Deposit(10, 6);
const twenty = new Deposit(20, 2, ten);
const fifty = new Deposit(50, 2, twenty);
const hundred = new Deposit(100, 1, fifty);

// Build ATM.
const atm = new ATM(hundred, fifty, twenty, ten);
atm.withdraw(310); // Cannot because ATM has only 300
atm.withdraw(100); // Can withdraw - 1x100

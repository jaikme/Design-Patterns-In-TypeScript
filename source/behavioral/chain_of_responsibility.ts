/*
🐝 Chain Of Responsibility
--------------------------

The chain of responsibility pattern is used to process varied requests, each of which may be dealt with by a different handler.

### Example:
*/

interface Withdrawing {
  withdraw(amount: number): boolean;
}

interface MoneyPileValues {
  value: number;
  quantity: number;
  next?: Withdrawing;
}

class MoneyPile implements Withdrawing, MoneyPileValues {
  static init(from: MoneyPileValues) {
    return new MoneyPile(from.quantity, from.value, from.next);
  }

  constructor(public value: number, public quantity: number, public next?: Withdrawing) {}

  withdraw(amount: number): boolean {
    let _amount = amount;
    const value = this.value;

    function canTakeSomeBill(want: number): boolean {
      return want / value > 0;
    }

    let quantity = this.quantity;

    while (canTakeSomeBill(_amount)) {
      if (quantity === 0) {
        break;
      }

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
// Create piles of money and link them together 10 < 20 < 50 < 100.**
const ten = new MoneyPile(10, 6);
const twenty = new MoneyPile(20, 2, ten);
const fifty = new MoneyPile(50, 2, twenty);
// Alternative with named arguments
const hundred = MoneyPile.init({ value: 100, quantity: 1, next: fifty });

// Build ATM.
const atm = new ATM(hundred, fifty, twenty, ten);
atm.withdraw(310); // Cannot because ATM has only 300
atm.withdraw(100); // Can withdraw - 1x100

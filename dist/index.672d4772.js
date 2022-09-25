"use strict";
// BANKIST APP
///////////////////////////////////////////////
// Data
// DIFFERENT DATA! Contains movement dates, currency and locale
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [
        200,
        455.23,
        -306.5,
        25000,
        -642.21,
        -133.9,
        79.97,
        1300
    ],
    interestRate: 1.2,
    pin: 1111,
    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2022-04-10T10:17:24.185Z",
        "2022-04-17T14:11:59.604Z",
        "2022-04-18T17:01:17.194Z",
        "2022-04-18T23:36:17.929Z",
        "2022-04-20T10:51:36.790Z", 
    ],
    currency: "EUR",
    locale: "pt-PT"
};
const account2 = {
    owner: "Jessica Davis",
    movements: [
        5000,
        3400,
        -150,
        -790,
        -3210,
        -1000,
        8500,
        -30
    ],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-04-20T12:01:20.894Z", 
    ],
    currency: "USD",
    locale: "en-US"
};
const accounts = [
    account1,
    account2
];
/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
/////////////////////////////////////////////////
// Functions
const movementDate = function(date, locale) {
    const caldatePassed = function(date2, date1) {
        return Math.round(Math.abs((date1 - date2) / 86400000));
    };
    const daysPassed = caldatePassed(new Date(), date);
    // console.log(daysPassed);
    if (daysPassed === 0) return `Today`;
    if (daysPassed === 1) return `Yesterday`;
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else return new Intl.DateTimeFormat(locale).format(date);
};
const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = "";
    const movs = sort ? acc.movements.slice().sort((a, b)=>a - b) : acc.movements;
    movs.forEach(function(mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";
        const date = new Date(acc.movementsDates[i]);
        const displayDate = movementDate(date, acc.locale);
        const fornattedMovement = new Intl.NumberFormat(acc.locale, {
            style: `currency`,
            currency: `${acc.currency}`
        }).format(mov);
        const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate} </div>
        <div class="movements__value">${fornattedMovement}</div></div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    // containerMovements.append(html);
    // containerMovements.prepend(html);
    });
};
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov)=>acc + mov, 0);
    const calculatedbal = new Intl.NumberFormat(acc.locale, {
        style: `currency`,
        currency: acc.currency
    }).format(acc.balance);
    // labelBalance.textContent = acc.balance
    labelBalance.textContent = `${calculatedbal}`;
};
const calcDisplaySummary = function(acc) {
    const incomes = acc.movements.filter((mov)=>mov > 0).reduce((acc, mov)=>acc + mov, 0);
    const suminalculation = new Intl.NumberFormat(acc.locale, {
        style: `currency`,
        currency: acc.currency
    }).format(incomes);
    labelSumIn.textContent = `${suminalculation}`;
    const out = acc.movements.filter((mov)=>mov < 0).reduce((acc, mov)=>acc + mov, 0);
    const outcalculation = Intl.NumberFormat(acc.locale, {
        style: `currency`,
        currency: acc.currency
    }).format(Math.abs(out));
    labelSumOut.textContent = `${outcalculation}`;
    const interest = acc.movements.filter((mov)=>mov > 0).map((deposit)=>deposit * acc.interestRate / 100).filter((int, i, arr)=>{
        // console.log(arr);
        return int >= 1;
    }).reduce((acc, int)=>acc + int, 0);
    const intrestcalculation = new Intl.NumberFormat(acc.locale, {
        style: `currency`,
        currency: acc.currency
    }).format(interest);
    labelSumInterest.textContent = `${intrestcalculation}`;
};
const createUsernames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner.toLowerCase().split(" ").map((name)=>name[0]).join("");
    });
};
createUsernames(accounts);
const updateUI = function(acc) {
    // Display movements
    displayMovements(acc);
    // Display balance
    calcDisplayBalance(acc);
    // Display summary
    calcDisplaySummary(acc);
};
const startlogoutTimer = function() {
    const tick = function() {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        // in each call, print the remainig time to the UI
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
            labelWelcome.textContent = ` user timeout login to get started  `;
            setTimeout(function() {
                labelWelcome.textContent = `login to get started`;
            }, 2000);
            containerApp.style.opacity = 0;
            clearInterval(timer);
        }
        time--; // this will reduce the number by one every sec
    // when the  time is at zero logout user
    };
    // setting the timmer to 5 minimum
    let time = 10;
    tick();
    // call the timmer every one second here
    const timer = setInterval(tick, 1000);
    return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;
const newDate = new Date();
// console.log(newDate);
// const day = `${newDate.getDay()}`.padStart(2, 0);
// const days = newDate.getTime();
// console.log(days);
// const month = `${newDate.getMonth() + 1}`.padStart(2, 0);
// const year = newDate.getFullYear();
// const hours = newDate.getHours();
// const min = newDate.getMinutes();
// const p = newDate.toLocaleDateString() + ` ${hours}:` + `${min}`;
// console.log(p);
const argue = {
    hours: `numeric`,
    minite: `numeric`,
    day: `numeric`,
    month: `numeric`,
    year: `numeric`
};
// const local = navigator.language;
// console.log(local);
// labelDate.textContent = new Intl.DateTimeFormat(local, argue).format(newDate);
// const international = new Intl.DateTimeFormat(`en-US`, argue).format(newDate);
// console.log(international);
// console.log(`${day}/${month}/${year}`);
btnLogin.addEventListener("click", function(e) {
    // Prevent form from submitting
    e.preventDefault();
    currentAccount = accounts.find((acc)=>acc.username === inputLoginUsername.value);
    console.log(currentAccount);
    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        containerApp.style.opacity = 100;
        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();
        // update time
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, argue).format(newDate);
        if (timer) clearInterval(timer);
        timer = startlogoutTimer();
        // Update UI
        updateUI(currentAccount);
    }
});
btnTransfer.addEventListener("click", function(e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    // const silde_down = btnTransfer.getBoundingClientRect
    const receiverAcc = accounts.find((acc)=>acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = "";
    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
        // Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        // updateing the movement date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
        // Update UI
        updateUI(currentAccount);
        // reset the timmer when a transfer is being carried output
        clearInterval(timer);
        timer = startlogoutTimer();
    }
});
btnLoan.addEventListener("click", function(e) {
    e.preventDefault();
    const amount = Math.floor(Number(inputLoanAmount.value));
    if (amount > 0 && currentAccount.movements.some((mov)=>mov >= amount * 0.1)) {
        // Add movement
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        // Update UI
        updateUI(currentAccount);
    }
    inputLoanAmount.value = "";
    clearInterval(timer);
    timer = startlogoutTimer();
});
btnClose.addEventListener("click", function(e) {
    e.preventDefault();
    if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
        const index = accounts.findIndex((acc)=>acc.username === currentAccount.username);
        console.log(index);
        // .indexOf(23)
        // Delete account
        accounts.splice(index, 1);
        // Hide UI
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = "";
    clearInterval(timer);
    timer = startlogoutTimer();
});
let sorted = false;
btnSort.addEventListener("click", function(e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(24 === 24.4);
// console.log(0.1 * 0.2 == 0.3);
// // convering a string to a number
// // 1)
// console.log(Number(`55`));
// // 2)
// console.log(+`55`);
// // using the parsing method
// // redix is being passed in by paresein and is the base of the system we are using
// console.log(Number.parseInt(`30px`, 10)); //this is used to read the figures in the UI that comes with letters // //// output will be  (30)
// console.log(Number.parseInt(`30px`));
// // the parseflote stops at the decimal point
// console.log(Number.parseFloat(`3.3px`, 10)); //this wil stop where the decimal is .... ///////// output(3.3)
// // isfinite method
// console.log(Number.isFinite(30)); // it returns a true or false if the value is
// // using the math method using
// console.log(Math.max(5, 1, 23, 24, 46, 76, 6)); //this is used to determine the maximum value in an array or a group of numbers
// console.log(Math.min(1, 24, 5, 63, 14, 12, 3)); //this is used determine the minimum value in the array of group of numbers
// // using the math method to calculate the redious of a circle
// console.log(Math.PI * Number.parseFloat(`10px`) ** 2);
// // generating rendom numbers
// console.log(Math.trunc(Math.random() * 6) + 1);
// // this is used to round a figure but won't work if it is a negative number we are recomended to use the floor method
// // floor method instead of using the trun method
// console.log(Math.floor(Math.random() * 6) + 1);
// // using it as a function
// const randomint = function (max, min) {
//   return Math.floor(Math.random() * (max - min) + 1) + min;
// };
// console.log(randomint(10, 20));
// // rounding integers .... they display an output without any descimal point
// this will round the figure without putting into consederation the numbers after the  decimal point
// console.log(Math.trunc(23.62));
// console.log(Math.floor(23.62));
// // this will round it up to the nearest decimal place
// console.log(Math.round(23.62));
// console.log(Math.ceil(23.62));
// console.log(Math.round(23.62));
// // flooting point numbers aks decimals
// // the Tofix method returns a string and not a number
// console.log((2.7).toFixed(5)); //this will return a string ........ to set the amount of decimal places we insert the number into the tofixed braket
// // both are the same
// console.log(+(2.7).toFixed()); //this will return a number.....to set the amount of decimal places we insert the number into the tofixed braket but it won't work if the string has benn cnverted to a number
// console.log(Number((2.775).toFixed())); //this will return a number .........to set the amount of decimal places we insert the number into the tofixed braket but it won't work if the string has been converted to a number
// the reminder operator ..... this is represented by (%)
// console.log(5 % 2); // this is the same thing as 2 * 2 + 1
// // a number is even when it is devisble by 2 and it give a 0 value
// const isEven = n => n % 2 == 0; // this is to determine if the number is an even number //////// if the not operator is added (!) it will ckeck for the ODD number
// console.log(isEven(23));
// console.log(isEven(32));
// console.log(isEven(14));
// console.log(isEven(8));
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll(`.movements__row`)].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = `orangered`;
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = `blue`;
//     }
//   });
// });
// const diameter = 287_460_000_000;
// console.log(diameter);
// // the underscore is only for the human readable eye .... it does not affect the output or what is being logged
// // working with BIGINT
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(Number.MIN_SAFE_INTEGER);
// // bigint is used to read bignumbers on javascript
// console.log(typeof 714874937734798392873877377278374832979n);
// // understaning date and time read
// // create a date
// // ... first method
// const now = new Date();
// console.log(now);
// // ....second method
// console.log(new Date(`nov 27 1999`));
// console.log(new Date(account1.movementsDates[0]));
// // different methods
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getTime());
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getMinutes());
// console.log(future.getTime(1650532627002));
// console.log(future.getHours());
// console.log(future.toISOString()); //universal time
// console.log(future.toJSON());
// console.log(new Date(1650532627002));
// console.log(Date.now(1650532627002));
// // more date operation
// const caldatePassed = function (date2, date1) {
//   return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
// };
// const days1 = caldatePassed(new Date(2022, 3, 14), new Date(2022, 3, 24));
// console.log(days1);
//
const options = {
    style: `currency`,
    unit: `mile-per-hour`,
    currency: `USD`,
    language: `en-US`
};
const num = 3505930;
// console.log(`in the USA`, Intl.NumberFormat(`en-US`, options).format(num));
const lamba = 18948743;
let pulana = new Intl.NumberFormat(options.language, {
    style: `currency`,
    currency: options.currency
}).format(lamba);
console.log(pulana);
const currentDate = new Date();
let pulanaDate = new Intl.DateTimeFormat(`en-US`, {
    day: `numeric`,
    month: `long`,
    year: `numeric`
}).format(currentDate);
console.log(pulanaDate);
const days_passed = function(date1, date2) {
    return (date2 - date1) / 86400000;
};
const days = days_passed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days);
// set timeout
setTimeout(function() {
    console.log(`here is your pizza`);
}, 3000);
console.log(`waiting`);
// u can not pass an argument here lyk the other we pass it after the time we set
const content = [
    `egg`,
    `fish`
];
const indomie = setTimeout(function(ing1, ing2) {
    console.log(`we got your order of indomie with ${ing1} and ${ing2}`);
}, 3000, // this is how arguments are passed here
...content // or we can also pass an argument as shown below by creating an array
);
if (content.includes(`crayfish`)) clearTimeout(indomie);
setInterval(function() {
    const new_time = new Date();
    const internationalized = new Intl.DateTimeFormat(`en-US`, {
        hour: `2-digit`,
        minute: `2-digit`,
        second: `2-digit`
    }).format(new_time);
// labelWelcome.textContent = ` ${internationalized}`;
// console.log(internationalized);
}, 1000);

//# sourceMappingURL=index.672d4772.js.map

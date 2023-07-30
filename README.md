# Count git commits

View the number of git commits per day in the current repo.

### Arguments

First argument is the date to view up to. Date formatted like `2023-07-29`

Second argument is the number of days in the past from the date.

e.g.

```shell
npx ts-node count.ts 2023-07-29 10
```

to see the number of git commits for 10 days in the past from 2023-07-29

### Run

```shell
npm start -- <date> <number of days>
```


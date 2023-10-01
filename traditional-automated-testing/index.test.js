const { groupPeople } = require("./index");

describe("test", () => {
    it("should pass", () => {

        const people = [
            { name: 'Alice', age: 15 },
            { name: 'Bob', age: 23 },
            { name: 'Charlie', age: 35 },
            { name: 'David', age: 40 },
            { name: 'Eva', age: 29 },
            { name: 'Frank', age: 50 },
            { name: 'Grace', age: 22 }
        ];

        const result = groupPeople(people);

        //
        // Uncomment this line to see the result of your code that you can then use in the expectations for your test:
        //
        // console.log(JSON.stringify(result, null, 2));
        //

        expect(result).toEqual({
            "results": {
                "50s": [
                    {
                        "name": "Frank",
                        "age": 50
                    }
                ],
                "40s": [
                    {
                        "name": "David",
                        "age": 40
                    }
                ],
                "30s": [
                    {
                        "name": "Charlie",
                        "age": 35
                    }
                ],
                "20s": [
                    {
                        "name": "Eva",
                        "age": 29
                    },
                    {
                        "name": "Bob",
                        "age": 23
                    },
                    {
                        "name": "Grace",
                        "age": 22
                    }
                ]
            },
            "groupCounts": {
                "50s": 1,
                "40s": 1,
                "30s": 1,
                "20s": 3
            }
        });
    });
});
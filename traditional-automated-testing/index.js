
//
// Groups people by age.
//
function groupPeople(people) {

    const results = people
        .filter(person => person.age >= 18)
        .map(person => ({ name: person.name, age: person.age }))
        .sort((a, b) => b.age - a.age)
        .reduce((acc, person) => {
            const decade = Math.floor(person.age / 10) * 10;
            const group = `${decade}s`;
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(person);
            return acc;
        }, {});

    const groupCounts = Object.keys(results).reduce((acc, group) => {
        acc[group] = results[group].length;
        return acc;
    }, {});

    return { results, groupCounts };
}

module.exports = {
    groupPeople,
};
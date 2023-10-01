const { replayRequests } = require(".");

test('check requests', async () => {
    await replayRequests();
});
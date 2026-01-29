async function selectOption(promptText, options) {
    const pageSize = 9;
    let page = 0;
    while (true) {
        console.clear();
        console.log(promptText);
        const start = page * pageSize;
        const end = Math.min(start + pageSize, options.length);

        for (let i = start; i < end; i++) {
            console.log(`${(i - start) + 1}. ${options[i]}`);
        }

        if (options.length > pageSize) {
            console.log("0. Next Page");
        }

        const selectedIndex = await new Promise(resolve => {
            process.stdin.resume(); // Ensure stdin is flowing
            process.stdin.once('data', (data) => {
                const val = parseInt(data.toString().trim());
                if (!isNaN(val)) resolve(val);
                else resolve(-1);
            });
        });

        if (selectedIndex === 0 && options.length > pageSize) {
            page++;
            if (page * pageSize >= options.length) {
                page = 0;
            }
        } else if (selectedIndex > 0 && selectedIndex <= (end - start)) {
            return start + (selectedIndex - 1);
        }
    }
}

module.exports = { selectOption };

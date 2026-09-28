/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const flights = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, '..', 'data', 'flights.json'), 'utf-8'));

const normalizeLocation = (value) => {
    if (!value) return undefined;
    return value
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const matchValue = (val) => {
    if (val === null || val === undefined) return undefined;
    return String(val).trim().toLowerCase();
};

function filterFlights({from, to, car}) {
    const normalizedFilters = {
        from: normalizeLocation(from),
        to: normalizeLocation(to),
        car: car ? String(car).trim().toLowerCase() : undefined
    };

    const compareFilters = {
        from: normalizedFilters.from?.toLowerCase(),
        to: normalizedFilters.to?.toLowerCase(),
        car: normalizedFilters.car
    };

    const filtered = flights.filter(doc => {
        const docFrom = matchValue(doc.from);
        const docTo = matchValue(doc.to);
        const subtitleValue = matchValue(doc.subtitle);
        const subtitleCity = subtitleValue?.split(',')[0]?.trim();
        const titleValue = matchValue(doc.title);
        const detailsValue = Array.isArray(doc.details) ? doc.details.join(' ').toLowerCase() : '';

        if (compareFilters.from) {
            const matchesFrom = docFrom === compareFilters.from;
            const matchesTitleFrom = !!titleValue && titleValue.includes(compareFilters.from);
            const matchesSubtitleFrom = !!subtitleValue && (subtitleValue.includes(compareFilters.from) || subtitleCity === compareFilters.from);
            if (!matchesFrom && !matchesTitleFrom && !matchesSubtitleFrom) return false;
        }

        if (compareFilters.to) {
            const matchesTo = docTo === compareFilters.to;
            const matchesSubtitle = !!subtitleValue && (subtitleValue.includes(compareFilters.to) || subtitleCity === compareFilters.to);
            if (!matchesTo && !matchesSubtitle) return false;
        }

        if (compareFilters.car) {
            const carTerm = compareFilters.car;
            const matchesTitle = !!titleValue && titleValue.includes(carTerm);
            const matchesDetails = !!detailsValue && detailsValue.includes(carTerm);
            const matchesSubtitle = !!subtitleValue && subtitleValue.includes(carTerm);
            if (!matchesTitle && !matchesDetails && !matchesSubtitle) return false;
        }

        return true;
    });

    return filtered;
}

const tests = [
    {from: 'Mumbai', to: 'Goa'},
    {from: 'Mumbai', to: 'Kolkata'},
    {from: 'Jaipur', to: 'Goa'},
    {from: 'Goa', to: 'Delhi'},
];

for (const t of tests) {
    console.log('Query:', t);
    const res = filterFlights(t);
    console.log('Matches:', res.length);
    if (res.length > 0) {
        console.log(res.map(r => `${r.id} ${r.title} (${r.from} -> ${r.to})`).join('\n'))
    }
    console.log('---');
}

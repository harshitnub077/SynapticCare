const thresholds = require("../config/thresholds.json");

class ParserService {
    /**
     * Parse medical report text and extract structured data
     */
    parseReport(text) {
        const results = [];
        const lines = text.split("\n");

        // Extract lab tests
        for (const testName in thresholds.labTests) {
            const testConfig = thresholds.labTests[testName];
            const pattern = this.buildPattern(testConfig.aliases);

            for (const line of lines) {
                const match = line.match(pattern);
                if (match) {
                    const value = this.extractValue(line);
                    if (value !== null) {
                        results.push({
                            test: testName,
                            value: value,
                            unit: testConfig.unit,
                            rawLine: line.trim(),
                        });
                    }
                }
            }
        }

        return results;
    }

    /**
     * Build regex pattern from aliases
     */
    buildPattern(aliases) {
        const aliasPattern = aliases.join("|");
        return new RegExp(`(${aliasPattern})`, "i");
    }

    /**
     * Extract numeric value from text line
     */
    extractValue(line) {
        // Match patterns like "12.5", "12.5 g/dL", "Hemoglobin: 12.5"
        const valueMatch = line.match(/(\d+\.?\d*)/);
        return valueMatch ? parseFloat(valueMatch[1]) : null;
    }

    /**
     * Flag abnormal values based on thresholds
     */
    flagAbnormalities(parsedData, gender = "male") {
        const flags = [];

        for (const result of parsedData) {
            const testConfig = thresholds.labTests[result.test];
            if (!testConfig) continue;

            const range = testConfig.normalRange[gender] || testConfig.normalRange;

            if (result.value < range.min) {
                flags.push({
                    test: result.test,
                    value: result.value,
                    unit: result.unit,
                    status: "low",
                    normalRange: `${range.min}-${range.max}`,
                    message: `${result.test} is below normal range`,
                });
            } else if (result.value > range.max) {
                flags.push({
                    test: result.test,
                    value: result.value,
                    unit: result.unit,
                    status: "high",
                    normalRange: `${range.min}-${range.max}`,
                    message: `${result.test} is above normal range`,
                });
            }
        }

        return flags;
    }

    /**
     * Complete analysis pipeline
     */
    analyze(extractedText, gender = "male") {
        const parsedData = this.parseReport(extractedText);
        const flags = this.flagAbnormalities(parsedData, gender);

        return {
            parsedData,
            flags,
            summary: {
                totalTests: parsedData.length,
                abnormalTests: flags.length,
            },
        };
    }
}

module.exports = new ParserService();

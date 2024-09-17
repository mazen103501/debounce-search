"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
// Debounce function
var debounce = function (func, delay) {
    var timeoutId;
    var abortController = null;
    return function (query) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();
        var signal = abortController.signal;
        timeoutId = window.setTimeout(function () {
            func(query, signal);
        }, delay);
    };
};
// Search locations function
var searchLocations = function (query, signal) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                setLoading(true);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, fetch("https://nominatim.openstreetmap.org/search?format=json&q=".concat(query), { signal: signal })];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                updateErrorMessage(""); // Clear any previous error message
                displayResults(data);
                return [3 /*break*/, 6];
            case 4:
                error_1 = _a.sent();
                if (error_1 instanceof Error) {
                    if (error_1.name === "AbortError") {
                        console.log("Fetch aborted");
                    }
                    else {
                        console.error("Error fetching data:", error_1);
                        updateErrorMessage("Error fetching data: " + error_1.message);
                    }
                }
                else {
                    console.error("Unknown error", error_1);
                    updateErrorMessage("Unknown error");
                }
                return [3 /*break*/, 6];
            case 5:
                setLoading(false); // Hide loading indicator
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Display results function
var displayResults = function (results) {
    var resultsList = document.getElementById("results-list");
    if (resultsList) {
        resultsList.innerHTML = "";
        results.forEach(function (result) {
            var listItem = document.createElement("li");
            listItem.textContent = result.display_name;
            resultsList.appendChild(listItem);
        });
    }
};
// Debounced search function
var debouncedSearch = debounce(searchLocations, 1000);
// Event listener for the input field
(_a = document.getElementById("search-input")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", function (event) {
    var target = event.target;
    updateErrorMessage(""); // Clear any previous error message
    // Clear the results if the input is empty and return early from the function to avoid making a request
    if (target.value.length === 0) {
        displayResults([]);
        setLoading(false); // Hide loading indicator
        return;
    }
    debouncedSearch(target.value);
});
// Update Error Message In The DOM
var updateErrorMessage = function (message) {
    var errorSpan = document.querySelector(".search-container span");
    if (errorSpan) {
        errorSpan.textContent = message;
    }
};
// Set Loading State
var setLoading = function (isLoading) {
    var loadingDiv = document.getElementById("loading");
    if (loadingDiv) {
        loadingDiv.style.display = isLoading ? "block" : "none";
    }
};

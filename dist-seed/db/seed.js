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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var dexie_1 = require("./dexie");
var nanoid_1 = require("nanoid");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var tags, stages, jobs, candidates, assessments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dexie_1.db.jobs.clear()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dexie_1.db.candidates.clear()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dexie_1.db.assessments.clear()];
                case 3:
                    _a.sent();
                    tags = ['frontend', 'backend', 'design', 'qa', 'devops'];
                    stages = ['applied', 'screen', 'interview', 'offer', 'hired', 'rejected'];
                    jobs = Array.from({ length: 25 }).map(function (_, i) { return ({
                        id: (0, nanoid_1.nanoid)(),
                        title: "Job ".concat(i + 1, " - ").concat(tags[i % tags.length]),
                        slug: "job - ".concat(i + 1),
                        status: i % 5 === 0 ? 'archived' : 'active',
                        tags: [tags[i % tags.length]],
                        order: i + 1,
                        createdAt: Date.now() - i * 1000,
                    }); });
                    return [4 /*yield*/, dexie_1.db.jobs.bulkAdd(jobs)];
                case 4:
                    _a.sent();
                    candidates = Array.from({ length: 1000 }).map(function () { return ({
                        id: (0, nanoid_1.nanoid)(),
                        name: "Candidate ".concat(Math.floor(Math.random() * 10000)),
                        email: "cand".concat(Math.floor(Math.random() * 10000), "@example.com"),
                        jobId: jobs[Math.floor(Math.random() * jobs.length)].id,
                        stage: stages[Math.floor(Math.random() * stages.length)],
                        timeline: [],
                    }); });
                    return [4 /*yield*/, dexie_1.db.candidates.bulkAdd(candidates)];
                case 5:
                    _a.sent();
                    assessments = jobs.slice(0, 3).map(function (job, idx) { return ({
                        jobId: job.id,
                        title: "Assessment ".concat(idx + 1),
                        sections: [
                            {
                                id: (0, nanoid_1.nanoid)(),
                                title: 'General',
                                questions: Array.from({ length: 10 }).map(function (__, qidx) { return ({
                                    id: (0, nanoid_1.nanoid)(),
                                    label: "Q".concat(qidx + 1),
                                    type: qidx % 3 === 0 ? 'short' : 'single',
                                    required: qidx % 2 === 0,
                                    meta: { choices: ['Yes', 'No', 'Maybe'] },
                                }); })
                            }
                        ]
                    }); });
                    return [4 /*yield*/, dexie_1.db.assessments.bulkAdd(assessments)];
                case 6:
                    _a.sent();
                    console.log('Seeding complete');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) { console.error(err); process.exit(1); });

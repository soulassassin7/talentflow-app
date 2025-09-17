"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.TalentDB = void 0;
var dexie_1 = __importDefault(require("dexie"));
var TalentDB = /** @class */ (function (_super) {
    __extends(TalentDB, _super);
    function TalentDB() {
        var _this = _super.call(this, 'talentflow-db') || this;
        _this.version(1).stores({
            jobs: 'id,slug,title,order,status',
            candidates: 'id,name,email,jobId,stage',
            assessments: 'jobId'
        });
        return _this;
    }
    return TalentDB;
}(dexie_1.default));
exports.TalentDB = TalentDB;
exports.db = new TalentDB();

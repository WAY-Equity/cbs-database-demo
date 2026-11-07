import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../src/seed.ts';
import {validateRelations,validateReportStatus,readDatabase,encodeCsv} from '../src/model.ts';
test('all fictional records have matching parent references',()=>{const db=createSeed();assert.deepEqual(validateRelations(db),[]);assert.equal(db.properties.length,16);assert.ok(db.reports.every(r=>db.jobs.find(j=>j.id===r.jobId)?.status==='作業完了'))});
test('reports cannot advance with missing materials or responsibility',()=>{const r=createSeed().reports[0];assert.ok(validateReportStatus({...r,received:[]},'確認待ち'));assert.ok(validateReportStatus({...r,received:r.required,reviewer:''},'提出済み'));assert.equal(validateReportStatus({...r,received:r.required,reviewer:'担当',finding:'確認済み'},'提出済み'),'')});
test('storage roundtrip and malformed data rejection',()=>{const db=createSeed();assert.deepEqual(readDatabase(JSON.stringify(db),createSeed),db);assert.throws(()=>readDatabase('{bad',createSeed));db.reports[0].jobId='missing';assert.throws(()=>readDatabase(JSON.stringify(db),createSeed))});
test('CSV escapes quotes and neutralizes spreadsheet formulas',()=>{assert.equal(encodeCsv([['=1+1','a"b']]),'\uFEFF"\'=1+1","a""b"')});

test('branch views retain valid links without mutating the shared database',async()=>{const {scopeDatabase}=await import('../src/model.ts');const db=createSeed();for(const branch of ['神戸','大阪'] as const){const view=scopeDatabase(db,branch);assert.equal(view.properties.length,8);assert.ok(view.properties.every(p=>p.branch===branch));assert.deepEqual(validateRelations(view),[]);assert.ok(view.jobs.every(j=>view.properties.some(p=>p.id===j.propertyId)))}assert.equal(db.properties.length,16)});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attendanceSource,attendanceIssue,workMinutes,attendanceTotals,validatePhotoSlots} from '../src/automation-logic.ts';
test('attendance calculates breaks in minutes and only includes confirmed rows',()=>{assert.equal(workMinutes(attendanceSource[1]),420);assert.equal(workMinutes(attendanceSource[2]),null);const confirmed=attendanceSource.map(r=>({...r,reviewed:true}));assert.deepEqual(Object.values(attendanceTotals(confirmed)),[600,480])});
test('blank, invalid, reversed, and invalid break times are blocked',()=>{const r=attendanceSource[0];for(const patch of [{end:''},{end:'07:00'},{end:'25:00'},{start:'09:70'},{breakMinutes:180},{breakMinutes:-1},{breakMinutes:NaN}]){assert.ok(attendanceIssue({...r,...patch}));assert.equal(workMinutes({...r,...patch}),null)}});
test('photo mapping rejects duplicates and missing references',()=>{assert.equal(validatePhotoSlots(['A','B'],['A','B','C']),true);assert.equal(validatePhotoSlots(['A','A'],['A','B']),false);assert.equal(validatePhotoSlots(['A','Z'],['A','B']),false)});

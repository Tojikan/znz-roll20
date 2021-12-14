// import { sgRoll } from "../src/scripts/_Roll-SG";
// import { strict as assert } from 'assert';


// describe ('Z Roll test', function(){


//     it('Error messages', function(){
//         let err1 = {
//             sdice: '',
//             gdice: '',
//             anything: ''
//         };

//         assert.ok('error' in sgRoll.handleRoll(err1, {}));

//         let err2 = {
//             success: '',
//             guard: '',
//             anything: ''
//         };

//         assert.ok('error' in sgRoll.handleRoll(err2, {}));

//         // not integer
//         let err3 = {
//             success: 5.123,
//             guard: 5.2,
//             sdice: '',
//             gdice: ''
//         };
//         let err4 = {
//             success: 'fail',
//             guard: 'nothing',
//             sdice: '',
//             gdice: ''
//         };

//         assert.ok('error' in sgRoll.handleRoll(err3, {}));
//         assert.ok('error' in sgRoll.handleRoll(err4, {}));
//     });


//     it('limits rolls', function(){
//         let limit1 = {
//             success: 5,
//             guard: 4,
//             sdice: '',
//             gdice: '',
//             limit: 5
//         }

//         let result1 = sgRoll.handleRoll(limit1, {});

//         assert.ok(result1.guard.limited);
//         assert.ok(!result1.success.limited);
//         assert.equal(result1.guard.rolls, 0);

//         let limit2 = {
//             success: 5,
//             guard: 4,
//             sdice: '',
//             gdice: '',
//             limit: 3
//         }

//         let result2 = sgRoll.handleRoll(limit2, {});

//         assert.ok(result2.guard.limited);
//         assert.ok(result2.success.limited);
//         assert.equal(result2.guard.rolls, 0);
//         assert.equal(result2.success.rolls, 3);

//         let limit3 = {
//             success: 5,
//             guard: 4,
//             sdice: '',
//             gdice: '',
//             limit: 10
//         };

//         let result3 = sgRoll.handleRoll(limit3, {});

//         assert.ok(!result3.guard.limited);
//         assert.ok(!result3.success.limited);
//         assert.equal(result3.guard.rolls, 4);
//         assert.equal(result3.success.rolls, 5);
//     });
// })
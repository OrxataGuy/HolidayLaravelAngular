<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\API\HolidayController as Holidays;
use App\Http\Controllers\API\UserController as Users;

Route::middleware('auth:api')->get('/token/revoke', function (Request $request) {
    DB::table('oauth_access_tokens')
        ->where('user_id', $request->user()->id)
        ->update([
            'revoked' => true
        ]);
    return response()->json(array('status' => 200));
});

Route::middleware('auth:api')->group(function() {
    Route::resource('holidays', Holidays::class)->only('store', 'update', 'destroy');
    Route::get('holidays', [Holidays::class, 'list']);
    Route::resource('users', Holidays::class)->only('destroy');
    Route::put('users/upgrade/{user}', [Users::class, 'upgrade']);
    Route::put('users/downgrade/{user}', [Users::class, 'downgrade']);
});

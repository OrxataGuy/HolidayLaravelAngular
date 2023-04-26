<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use \Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

    public function upgrade(Request $request, $id) : JsonResponse
    {
        if($request->get('power') != 2) return response()->json(array(
            'status' => 401,
            'value' => 'Unauthorized operation'
        ));

        $user = User::find($id);
        $user->role_id=2;
        $user->save();

        return response()->json(array([
            'status' => 200,
            'value' => 'The user has been successfully upgraded'
        ]));
    }

    public function downgrade(Request $request, $id) : JsonResponse
    {
        if($request->get('power') != 2) return response()->json(array(
            'status' => 401,
            'value' => 'Unauthorized operation'
        ));
        $user = User::find($id);
        $user->role_id=1;
        $user->save();

        return response()->json(array([
            'status' => 200,
            'value' => 'The user has been successfully downgraded'
        ]));
    }

    public function destroy($id) : JsonResponse
    {
        $user = User::find($id);
        $user->delete();

        return response()->json(array([
            'status' => 200,
            'value' => 'The holiday was deleted successfully'
        ]));
    }
}

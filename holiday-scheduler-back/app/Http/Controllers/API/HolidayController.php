<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;
use \Illuminate\Http\JsonResponse;


class HolidayController extends Controller
{

    public function list() : JsonResponse
    {
        return response()->json(array(
            'status' => 200,
            'value' => Holiday::with('user')->get()
        ));
    }

    public function store(Request $request) : JsonResponse
    {
        $holiday = Holiday::create([
            'date' => $request->get('date'),
            'user_id' => $request->get('user_id'),
            'pending' => $request->get('power')==2 ? 0 : 1,
            'validated' => $request->get('power')==2 ? 1 : 0,
        ]);

        if($holiday)
        return response()->json(array(
            'status' => 200,
            'value' => $holiday
        ));

        return response()->json(array(
            'status' => 400,
            'value' => 'The holiday was not created successfully'
        ));
    }

    public function update(Request $request, $id)
    {
        if($request->get('power') != 2) return response()->json(array(
            'status' => 401,
            'value' => 'Unauthorized operation'
        ));

        $holiday = Holiday::find($id);
        if($request->get('validate') == 1) {
            $holiday->validated = 1;
            $holiday->pending = 0;
            $holiday->save();
        }else{
            $holiday->delete();
        }
        return response()->json(array(
            'status' => 200,
            'value' => 'The holiday was updated successfully'
        ));
    }

    public function destroy($id)
    {
        $holiday = Holiday::find($id);
        $holiday->delete();
        return response()->json(array(
            'status' => 200,
            'value' => 'The holiday was deleted successfully'
        ));
    }
}

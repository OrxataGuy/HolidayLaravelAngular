<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Models\Role;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Role::create([
            'name' => 'Employee'
        ]);

        Role::create([
            'name' => 'Boss'
        ]);

        User::create([
            'name' => 'John',
            'email' => 'john.doe@example.com',
            'role_id' => 1,
            'password' => Hash::make('JohnDoe.2023')
        ]);

        User::create([
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'role_id' => 1,
            'password' => Hash::make('JaneDoe.2023')
        ]);

        User::create([
            'name' => 'David',
            'email' => 'david.bowie@example.com',
            'role_id' => 2,
            'password' => Hash::make('DavidBowie.2023')
        ]);
    }
}

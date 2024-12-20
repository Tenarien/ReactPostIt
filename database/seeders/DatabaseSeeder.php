<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin account
        User::factory(1)->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::factory(50)->create();

        Post::factory(30)->create()->each(function ($post) {
            $parentComments = Comment::factory(30)->create([
                'post_id' => $post->id
            ]);

            $parentComments->each(function ($parentComment) use ($post) {
                $childComments = Comment::factory(rand(0, 5))->create([
                    'post_id' => $post->id,
                    'parent_id' => $parentComment->id
                ]);

                $childComments->each(function ($childComments) use ($post) {
                    $this->createChildComments($childComments, $post, 0);
                });
            });
        });
    }

    protected function createChildComments($comment, $post, $depth)
    {
        $maxDepth = 5;
        if ($depth >= $maxDepth) {
            return;
        }

        if(mt_rand(1, 100) <= 50) {
            $childComments = Comment::factory(rand(1, 3))->create([
                'post_id' => $post->id,
                'parent_id' => $comment->id
            ]);

            $childComments->each(function ($childComment) use ($post, $depth) {
                $this->createChildComments($childComment, $post, $depth + 1);
            });
        }
    }
}

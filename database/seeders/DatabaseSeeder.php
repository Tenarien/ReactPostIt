<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
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
            'password' => Hash::make('admin'),
            'role' => 'admin'
        ]);

        User::factory(50)->create();

        Post::factory(100)->create()->each(function ($post) {
            // Create all parent comments first
            $parentComments = Comment::factory(50)->create([
                'post_id' => $post->id
            ]);

            // Add children to the parent comments
            $parentComments->each(function ($parentComment) use ($post) {
                $this->createChildComments($parentComment, $post, 1); // Start recursion here
            });
        });

        $users = User::all()->pluck('id');

        // Add likes to posts
        Post::all()->each(function ($post) use ($users) {
            $randomUserIds = $users->random(rand(1, 25));
            $likes = $randomUserIds->map(function ($userId) use ($post) {
                return ['post_id' => $post->id, 'user_id' => $userId];
            });

            Like::insert($likes->toArray());
        });

        // Add likes to comments
        Comment::all()->each(function ($comment) use ($users) {
            $randomUserIds = $users->random(rand(1, 25));
            $likes = $randomUserIds->map(function ($userId) use ($comment) {
                return ['comment_id' => $comment->id, 'user_id' => $userId];
            });

            Like::insert($likes->toArray());
        });
    }

    protected function createChildComments($parentComment, $post, $depth)
    {
        $maxDepth = 5;
        if ($depth >= $maxDepth) {
            return;
        }

        if (mt_rand(1, 100) <= 50) { // 50% chance of creating child comments
            $childComments = Comment::factory(rand(1, 3))->create([
                'post_id' => $post->id,
                'parent_id' => $parentComment->id,
            ]);

            // Add further children for each new child
            $childComments->each(function ($childComment) use ($post, $depth) {
                $this->createChildComments($childComment, $post, $depth + 1);
            });
        }
    }
}

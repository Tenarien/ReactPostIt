<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'comment' => fn () => $request->session()->get('comment'),
            ],
            'auth.user' => fn () => $request->user()
                ? $request->user()->only('id', 'name', 'email', 'role')
                : null,
            'notifications' => fn () => $request->user()
                ? Notification::where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($notification) {
                        $notification->data = json_decode($notification->data, true);
                        return $notification;
                    })
                : [],
        ]);
    }
}

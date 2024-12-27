<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->morphs('reportable');
            $table->unsignedBigInteger('reported_by');
            $table->text('reason')->nullable();
            $table->enum('status', ['new', 'resolved', 'ignored', 'deleted'])->default('new');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->foreign('reported_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};

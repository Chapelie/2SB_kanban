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
        Schema::create('sub_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['Open', 'InProgress', 'Completed'])->default('Open');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->time('time_spent')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('parent_task_id')->constrained('tasks')->cascadeOnDelete();
            $table->date('due_date')->nullable();
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('attachments_count')->default(0);
            $table->timestamps(); // created_at + updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_tasks');
    }
};

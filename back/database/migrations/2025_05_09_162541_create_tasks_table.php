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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // ID auto-incrémenté (bigint)
            $table->string('title');
            $table->string('task_number')->unique(); // ex : #000001
            $table->date('opened_date');
            $table->foreignId('opened_by')->constrained('users')->cascadeOnDelete(); // clé étrangère vers users
            $table->enum('status', ['Open', 'InProgress', 'Completed', 'Canceled'])->default('Open');
            $table->time('time_spent')->nullable(); // HH:MM:SS
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('description')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('attachments_count')->default(0);
            $table->enum('kanban_status', ['backlog', 'in-progress', 'completed'])->default('backlog');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

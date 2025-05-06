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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable(); // pour "JJ MOIS ANNÉE"
            $table->enum('status', ['OnTrack', 'Offtrack', 'Completed'])->default('OnTrack');
            $table->unsignedInteger('issues_count')->default(0);
            $table->json('team_members')->nullable(); // tableau des membres (id)
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

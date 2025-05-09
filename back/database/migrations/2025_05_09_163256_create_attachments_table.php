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
        Schema::create('attachments', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedBigInteger('size'); // en octets
        $table->string('type'); // MIME type
        $table->string('url'); // lien vers fichier (Storage)
        $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
        $table->foreignId('task_id')->nullable()->constrained('tasks')->cascadeOnDelete();
        $table->foreignId('sub_task_id')->nullable()->constrained('sub_tasks')->cascadeOnDelete();
        $table->timestamp('uploaded_at')->useCurrent();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};

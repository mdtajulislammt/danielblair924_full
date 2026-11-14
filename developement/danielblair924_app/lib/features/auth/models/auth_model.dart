enum UserRole { client, member, admin }

class UserModel {
  final String id;
  final String email;
  final String? username;
  final String? fname;
  final String? lname;
  final String role;
  final String status;
  final String? avatarUrl;
  final DateTime? createdAt;

  const UserModel({
    required this.id,
    required this.email,
    this.username,
    this.fname,
    this.lname,
    this.role = 'MEMBER',
    this.status = 'ACTIVE',
    this.avatarUrl,
    this.createdAt,
  });

  String get fullName {
    final parts = [fname, lname].where((s) => s != null && s!.trim().isNotEmpty).toList();
    if (parts.isNotEmpty) return parts.join(' ');
    if (username != null && username!.trim().isNotEmpty) return username!;
    return email.contains('@') ? email.split('@').first : email;
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: (json['id'] ?? '') as String,
      email: (json['email'] ?? '') as String,
      username: json['username'] as String?,
      fname: json['fname'] as String?,
      lname: json['lname'] as String?,
      role: (json['role'] ?? 'MEMBER') as String,
      status: (json['status'] ?? 'ACTIVE') as String,
      avatarUrl: json['avatarUrl'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'username': username,
    'fname': fname,
    'lname': lname,
    'role': role,
    'status': status,
    'avatarUrl': avatarUrl,
    'createdAt': createdAt?.toIso8601String(),
  };
}

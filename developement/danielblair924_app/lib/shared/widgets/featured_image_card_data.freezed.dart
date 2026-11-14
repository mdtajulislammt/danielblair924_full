// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'featured_image_card_data.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$FeaturedImageCardData {

 ImageProvider<Object> get imageProvider; String get title; String get subtitle; String get badgeText; String? get badgeHighlightText; String? get description;
/// Create a copy of FeaturedImageCardData
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeaturedImageCardDataCopyWith<FeaturedImageCardData> get copyWith => _$FeaturedImageCardDataCopyWithImpl<FeaturedImageCardData>(this as FeaturedImageCardData, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as FeaturedImageCardData;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeaturedImageCardData&&(identical(other.imageProvider, _this.imageProvider) || other.imageProvider == _this.imageProvider)&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.subtitle, _this.subtitle) || other.subtitle == _this.subtitle)&&(identical(other.badgeText, _this.badgeText) || other.badgeText == _this.badgeText)&&(identical(other.badgeHighlightText, _this.badgeHighlightText) || other.badgeHighlightText == _this.badgeHighlightText)&&(identical(other.description, _this.description) || other.description == _this.description));
}


@override
int get hashCode {
  final _this = this as FeaturedImageCardData;
  return Object.hash(runtimeType,_this.imageProvider,_this.title,_this.subtitle,_this.badgeText,_this.badgeHighlightText,_this.description);
}

@override
String toString() {
  final _this = this as FeaturedImageCardData;
  return 'FeaturedImageCardData(imageProvider: ${_this.imageProvider}, title: ${_this.title}, subtitle: ${_this.subtitle}, badgeText: ${_this.badgeText}, badgeHighlightText: ${_this.badgeHighlightText}, description: ${_this.description})';
}


}

/// @nodoc
abstract mixin class $FeaturedImageCardDataCopyWith<$Res>  {
  factory $FeaturedImageCardDataCopyWith(FeaturedImageCardData value, $Res Function(FeaturedImageCardData) _then) = _$FeaturedImageCardDataCopyWithImpl;
@useResult
$Res call({
 ImageProvider<Object> imageProvider, String title, String subtitle, String badgeText, String? badgeHighlightText, String? description
});




}
/// @nodoc
class _$FeaturedImageCardDataCopyWithImpl<$Res>
    implements $FeaturedImageCardDataCopyWith<$Res> {
  _$FeaturedImageCardDataCopyWithImpl(this._self, this._then);

  final FeaturedImageCardData _self;
  final $Res Function(FeaturedImageCardData) _then;

/// Create a copy of FeaturedImageCardData
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? imageProvider = null,Object? title = null,Object? subtitle = null,Object? badgeText = null,Object? badgeHighlightText = freezed,Object? description = freezed,}) {
  return _then(FeaturedImageCardData(
imageProvider: null == imageProvider ? _self.imageProvider : imageProvider // ignore: cast_nullable_to_non_nullable
as ImageProvider<Object>,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,subtitle: null == subtitle ? _self.subtitle : subtitle // ignore: cast_nullable_to_non_nullable
as String,badgeText: null == badgeText ? _self.badgeText : badgeText // ignore: cast_nullable_to_non_nullable
as String,badgeHighlightText: freezed == badgeHighlightText ? _self.badgeHighlightText : badgeHighlightText // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [FeaturedImageCardData].
extension FeaturedImageCardDataPatterns on FeaturedImageCardData {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeaturedImageCardData value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeaturedImageCardData() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeaturedImageCardData value)  $default,){
final _that = this;
switch (_that) {
case _FeaturedImageCardData():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeaturedImageCardData value)?  $default,){
final _that = this;
switch (_that) {
case _FeaturedImageCardData() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( ImageProvider<Object> imageProvider,  String title,  String subtitle,  String badgeText,  String? badgeHighlightText,  String? description)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeaturedImageCardData() when $default != null:
return $default(_that.imageProvider,_that.title,_that.subtitle,_that.badgeText,_that.badgeHighlightText,_that.description);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( ImageProvider<Object> imageProvider,  String title,  String subtitle,  String badgeText,  String? badgeHighlightText,  String? description)  $default,) {final _that = this;
switch (_that) {
case _FeaturedImageCardData():
return $default(_that.imageProvider,_that.title,_that.subtitle,_that.badgeText,_that.badgeHighlightText,_that.description);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( ImageProvider<Object> imageProvider,  String title,  String subtitle,  String badgeText,  String? badgeHighlightText,  String? description)?  $default,) {final _that = this;
switch (_that) {
case _FeaturedImageCardData() when $default != null:
return $default(_that.imageProvider,_that.title,_that.subtitle,_that.badgeText,_that.badgeHighlightText,_that.description);case _:
  return null;

}
}

}

/// @nodoc


class _FeaturedImageCardData implements FeaturedImageCardData {
  const _FeaturedImageCardData({required this.imageProvider, required this.title, required this.subtitle, required this.badgeText, this.badgeHighlightText, this.description});
  

@override final  ImageProvider<Object> imageProvider;
@override final  String title;
@override final  String subtitle;
@override final  String badgeText;
@override final  String? badgeHighlightText;
@override final  String? description;

/// Create a copy of FeaturedImageCardData
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeaturedImageCardDataCopyWith<_FeaturedImageCardData> get copyWith => __$FeaturedImageCardDataCopyWithImpl<_FeaturedImageCardData>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeaturedImageCardData&&(identical(other.imageProvider, imageProvider) || other.imageProvider == imageProvider)&&(identical(other.title, title) || other.title == title)&&(identical(other.subtitle, subtitle) || other.subtitle == subtitle)&&(identical(other.badgeText, badgeText) || other.badgeText == badgeText)&&(identical(other.badgeHighlightText, badgeHighlightText) || other.badgeHighlightText == badgeHighlightText)&&(identical(other.description, description) || other.description == description));
}


@override
int get hashCode {
    return Object.hash(runtimeType,imageProvider,title,subtitle,badgeText,badgeHighlightText,description);
}

@override
String toString() {
    return 'FeaturedImageCardData(imageProvider: $imageProvider, title: $title, subtitle: $subtitle, badgeText: $badgeText, badgeHighlightText: $badgeHighlightText, description: $description)';
}


}

/// @nodoc
abstract mixin class _$FeaturedImageCardDataCopyWith<$Res> implements $FeaturedImageCardDataCopyWith<$Res> {
  factory _$FeaturedImageCardDataCopyWith(_FeaturedImageCardData value, $Res Function(_FeaturedImageCardData) _then) = __$FeaturedImageCardDataCopyWithImpl;
@override @useResult
$Res call({
 ImageProvider<Object> imageProvider, String title, String subtitle, String badgeText, String? badgeHighlightText, String? description
});




}
/// @nodoc
class __$FeaturedImageCardDataCopyWithImpl<$Res>
    implements _$FeaturedImageCardDataCopyWith<$Res> {
  __$FeaturedImageCardDataCopyWithImpl(this._self, this._then);

  final _FeaturedImageCardData _self;
  final $Res Function(_FeaturedImageCardData) _then;

/// Create a copy of FeaturedImageCardData
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? imageProvider = null,Object? title = null,Object? subtitle = null,Object? badgeText = null,Object? badgeHighlightText = freezed,Object? description = freezed,}) {
  return _then(_FeaturedImageCardData(
imageProvider: null == imageProvider ? _self.imageProvider : imageProvider // ignore: cast_nullable_to_non_nullable
as ImageProvider<Object>,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,subtitle: null == subtitle ? _self.subtitle : subtitle // ignore: cast_nullable_to_non_nullable
as String,badgeText: null == badgeText ? _self.badgeText : badgeText // ignore: cast_nullable_to_non_nullable
as String,badgeHighlightText: freezed == badgeHighlightText ? _self.badgeHighlightText : badgeHighlightText // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on

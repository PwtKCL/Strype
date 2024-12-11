<img src="../../public/favicon.png" width="64" align="left">

# Guidelines to translations in Strype

The process for translating Strype is simple. It relies on text files, and the reference for all translations is the English version.

This guide details these basic steps to follow to make the translations:

-   [How to retrieve or create the translations files](#how-to-retrieve-or-create-the-translations-files)
-   [How to understand the translations files](#how-to-understand-the-translations-files)
-   [How to do the translations.](#how-to-do-the-translations) 
-   [How to submit the translations.](#how-to-submit-the-translations)

The same actions, plus testing your changes, can be achieved following this [alternative method (advanced): edit directly on GitHub)](#alternative-method-advanced-edit-directly-on-github)

>[!NOTE]
>Currently, all translations are taking effect in Strype when a new version of the application is released by the Strype team. So even if a translation has been received by the Strype team and included into the source code repository, it will be visible in the online tool only when the Strype team releases a new version.

## How to retrieve or create the translations files

To retrieve the translation files, you will need to locate them inside the Strype source code repository hosted in GitHub (<a href="https://github.com/k-pet-group/Strype/tree/main/src/localisation" target="_blank">https://github.com/k-pet-group/Strype/tree/main/src/localisation</a>).

The translation files for all supported locales are contained in **one subfolder per locale (as a <a href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes" target="_blank">2-letter code</a>)**. For example, the translations for English are in <code>/**en**/</code>, those of Spanish are in <code>/**es**/</code> and so on.

A locale subfolder contains several translation JSON files, their names start with the 2-letter code of the locale (for example, `en_main.json`). We split the translations in several files to ease the translation task and gather some specific translations separately (for example for Strype micro:bit).

The files you want to translate can be downloaded directly from the website (click on the subfolder, and click on the file you wish to download, you should see a download button near the top-right area of the page).

## How to understand the translations files

The translation files are <a href="https://en.wikipedia.org/wiki/JSON" target="_blank">JSON</a> files: formatted text files that define **_key_:_value_ pairs**. There are several files per language, identified by the corresponding locale and gathered inside one subfolder for that locale (see section [1](#how-to-retrieve-or-create-the-translations-files) for more details).

The *key* is used by Strype as *a reference* to a localisable text, independent of the locale.  
The corresponding *value* is the localised text *that will be displayed* in Strype, in a given locale.  
The *key* and its corresponding *value* are separated by a colon `:`.

Here is an example of a *key:value* pair for English, where the *key* (i.e.reference) used by Strype is <img src="./img/bluecode-strypeFileDesc.png" alt="strypeFileDesc" align="center" width="136"> and the *value* displayed in Strype is <img src="./img/redcode-Strype project file.png" alt="text"  align="center" width="179">.

<img src="./img/translations_KVP_example.png">

>[!CAUTION]
>Only the **value** text need to be translated.</span>

## How to do the translations

To add translations *for a new locale* in Strype:
- download the English file (see section [1](#how-to-retrieve-or-create-the-translations-files)),
- rename your file copy to your locale (see section [1](#how-to-retrieve-or-create-the-translations-files)),
- translate the values (see section [2](#how-to-understand-the-translations-files)).

Similarly, to add or edit translations *for an existing locale* in Strype:
- download the locale file,
- add the missing *key:value* pairs based on the English locale file, or edit the exisiting translations.

(The expected file encoding is **UTF-8**, which would be default encoding in most modern text editors.)

Here are a few rules to follow when doing the translations of the text *values*.

- Leading and trailing spaces showing in the English *value* texts **should be maintained** in the translated locale.
- Some *value* texts contain Unicode characters starting with `\u`, followed by 4 characters. The *key* for these pairs is in this format: `<Python keyword>_detail`. The Unicode characters represent a Python keyword.
  - The Unicode characters **should not be altered** in the translation.
  - A translation of the Python keyword can be added into brackets for the given locale.<br>For example, the English reference contains this *key:value* pair:<br><img src="./img/translations_unicodechars_example.png"><br>which can be translated in another locale as such:<br><img src="./img/translations_unicodechars_example2.png"><br>The Unicode characters stay the same in both locales, and <img src="./img/redcode-(si).png" alt="(si)" align="center" width="48"> has been added in the translation to provide the literal translation of the Python keyword too.
- Some *value* texts contain HTML tags or codes (such as `<b>` or `&larr;`). They are interpreted as such by Strype to style the text in the browser, and therefore **should stay in the translation**. However the text content between the opening and closing tags can be translated if that makes sense.
- Some *value* texts contain curly brackets surrounding a word. These are used by Strype as placeholders to dynamically add pieces of text within the translation, and therefore the content between the curly brackets **should not be changed**.
- Some *value* texts contain an escaped character starting with `\` which **should stay in the translation**. 
For example, the English reference contains this *key:value* pair:<br><img src="./img/translations_escapechars_example.png"><br>That can be translated in another locale as such:<br><img src="./img/translations_escapechars_example2.png"><br>The escape character `\n` is left in the translation.
- For the micro:bit documentation translation, the English reference is based on <a href="https://microbit-micropython.readthedocs.io" target="_blank">the micro:bit documentation</a> which may be available in other languages.

>[!IMPORTANT]
>In case of doubts, please contact us ([team@strype.org](mailto:team@strype.org)) for explanations.

## How to submit the translations

You can send the locale file(s) to us directly ([team@strype.org](mailto:team@strype.org)).

>[!NOTE]
>Since English is the reference language used by Strype, *any missing translations in a locale will be rendered in Strype in English*. This means that if you prefer sending us your translations in several steps (for example, a file at a time), Strype will still be able to run with some missing translations.

## Alternative method (advanced): edit directly on GitHub

Alternatively, you may prefer contributing to the translations of Strype using Git. Strype is hosted in GitHub at <a href="https://github.com/k-pet-group/Strype" target="_blank">https://github.com/k-pet-group/Strype</a>.

>[!NOTE]
>It is advised, if you want to retrieve a copy of the Strype source code, to <ins>first create a fork of the project into your own GitHub account</ins>, and use your forked project as a remote Git repository.

### Making changes
If you prefer using Git, you will be able to make changes in the Strype localisation files directly on GitHub (in your forked account), or locally after cloning your forked project.

First read the basic steps sections to familiarise yourself with the localisation files location (see [1](#how-to-retrieve-or-create-the-translations-files)), format (see [2](#how-to-understand-the-translations-files)) and rules to follow for the translation process (see [3](#how-to-do-the-translations)).

>[!NOTE]
>This guide focuses on translations *directly* handled by the Strype website. Translators may otherwise contribute to the localisation of <a href="https://github.com/Tobias-Kohn/TigerPython-Parser" target="_blank">TigerPython</a>, which is used by Strype to display Python parsing error messages.

### Testing your changes

The only way to see how your translations are rendered in Strype is to clone the project source code (with Git) and run it.
  
If you have edited your translations *outside* the code source (for example if started working on a translation before downloading and installing the Strype project), you need to make sure that your changes are applied into your local copy of Strype before running the project.

Read the project’s <a href="../../README.md" target="_target">README</a> for understanding how to run the Strype locally from your Git copy.

>[!TIP]
>When you want to check which translations are missing from Strype, run the project as explained above, and once your local version of the Strype application is opened with your Internet browser, open the development tool (<a href="https://jeffrey1183.gitbooks.io/intro-to-programming/content/front-end-development/what-is-javascript/4developer-tools-on-different-browsers.html" target="_blank">how?</a>).

You will see each JSON keys that are missing a value.

Example:

<img src="./img/translations_missingKVP_devtools.png">

### Submit your changes

If may prefer sending us your changes using a GitHub pull request rather than sending the modified file(s) via email (see [4](#how-to-submit-the-translations)).
